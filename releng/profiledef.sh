#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-3.0-or-later

profile_name='Solara'
profile_desc='Elegant Linux Distribution'

image_name='Solara'
image_type='iso'
iso_application='Solara'
iso_publisher='Solara Team'
iso_version=$(date +%Y.%m.%d)
install_dir='Solara'
boot_mode='uefi-x64'
archiso_auto_format='true'
archiso_echo='true'
archiso_used_cache='true'
archiso_http_srv='${HOME}/Documents/archiso'
archiso_git_srv='https://github.com'