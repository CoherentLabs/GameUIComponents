from __future__ import print_function
import argparse
import os
import re
from importlib import import_module
from subprocess import call


def install_and_import(package):
    try:
        import_module(package)
    except ImportError:
        print('The Python2 "mistune" module was missing from your system. Installing it for you now!')
        call(["pip", "install", package])
    finally:
        globals()[package] = import_module(package)


# Make sure mistune module is installed
# This has to be called before the next line
# because it is needed for the NewLinesDetector
# class which is inheriting from a mistune class
install_and_import('mistune')


class NewlinesDetector(mistune.HTMLRenderer):
    split_sentences = False
    faulty_sentences = []

    def paragraph(self, text):
        if '\n' in text or '\r' in text:
            self.split_sentences = True
            self.faulty_sentences.append(text)
        return mistune.HTMLRenderer.paragraph(self, text)

    def split_sentences_detected(self):
        return self.split_sentences

    def get_faulty_sentences(self):
        return self.faulty_sentences

    def reset(self):
        self.split_sentences = False
        self.faulty_sentences = []


def convert_to_html_and_parse(dir):
    faulty_files = []
    new_lines_detector = NewlinesDetector()
    for root, _, files in os.walk(dir):
        # Skip the API Reference directory, as we don't format that
        if 'api_reference' in root.lower():
            continue
        for file in files:
            if file.endswith('.md') and file != 'Copyright.md':
                markdown_file = os.path.join(root, file)
                with open(markdown_file, 'r') as file:
                    content = file.read()
                    # We need to trim this pattern, to not generate errors
                    # Looking for the start of each Hugo markdown:
                    # ---
                    # *Anything in between, but we must have a title*
                    # title *Anything and ignoring position of :*
                    # *Anything in between*
                    # ---
                    pattern = r"(?s)---\n.*?(title).*?---"
                    content = re.sub(pattern, '', content)
                    # We use the default settings that are used
                    # when calling mitsune.html(), in order to
                    # not generate errors for certain formats
                    markdown = mistune.create_markdown(
                        escape=False,
                        renderer=new_lines_detector,
                        plugins=['strikethrough', 'footnotes', 'table'],
                    )
                    markdown(content)
                if new_lines_detector.split_sentences_detected():
                    faulty_files.append((markdown_file, new_lines_detector.get_faulty_sentences()))
                    new_lines_detector.reset()

    if faulty_files:
        print('The following files contain split sentences:\n')
        for file, faulty_sentences in faulty_files:
            print('File "%s":' % file)
            for sentence in faulty_sentences:
                print('"%s"\n' % sentence)
        error_msg = (
            "Error: Encountered new lines in one or more paragraph(s)! "
            "Please rewrite your sentence(s) to be on the same line!"
        )
        raise Exception(error_msg)
    else:
        print('All files are properly formatted!')


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--directory', '-d', help='A directory path to search recursively for markdown files.')

    options = parser.parse_args()

    if options.directory is not None:
        print('Checking markdown files for illegal newlines...\n')
        convert_to_html_and_parse(options.directory)
    else:
        print('You must provide a directory path!')


if __name__ == '__main__':
    main()
