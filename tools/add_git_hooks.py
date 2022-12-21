import os
import glob
import stat


def generate_hooks(repo_root, hooks_dir, dest):
    stub_format = """#!/bin/bash
if [ -f "{0}" ]
then
    exec "{0}" $@
else
    echo "Skipping hook {0} since it does not exist."
fi
"""
    hooks_list = glob.glob(hooks_dir + "/*")
    for hook in hooks_list:
        hook_name = os.path.join(dest, os.path.basename(hook))
        hook_from_repo = os.path.relpath(hook, repo_root)

        with open(hook_name, 'w') as f:
            f.write(stub_format.format(hook_from_repo.replace('\\', '/')))
        os.chmod(hook_name, stat.S_IRWXU)


def copy_hooks(base_dir):
    hooks_dir = os.path.join(base_dir, 'tools/hooks')
    dest = os.path.join(base_dir, '.git/hooks')
    generate_hooks(base_dir, hooks_dir, dest)


if __name__ == '__main__':
    print('Copying hooks')
    base_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..')
    copy_hooks(base_dir)
    print('Done')
