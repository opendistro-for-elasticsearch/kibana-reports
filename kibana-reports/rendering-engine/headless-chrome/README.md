## Chrome Binaries for Kibana Reports used by Puppeteer
Headless Chrome for Linux and Mac are chrome binaries which are significantly smaller than the standard binaries shipped by Google and Puppeteer. 
Chrome binary can be built from shell script build_headless_chrome.sh for Mac, Linux x64 and Linux arm64, 
output of script is called headless_shell.

## Puppeteer's Chrome version

Find the puppeteer version used in Kibana node_modules.json and get the associated chrome SHA to build from crrev.com and puppeteer repositories. Puppeteer 1.9 uses rev 674921 with commit sha as 312d84c8ce62810976feda0d3457108a6dfff9e6)

## headless Chrome folder structure
-chromium
 |-chromium
   |-chromium
     |-src
       |-out
         |-headless
           |-headless_shell     # output of scripts

## How to generate the headless_chrome
This is a shell script to set environment variable, download the source code and build the executable.

## Commands to create headless_chrome
Run below command to create headless_shell for each platform

headless-chrome.sh chrome-version-SHA (arch_name (arm64))
. Mac x64: ./build_headless_chrome.sh <chrome-version-SHA>
. Linux x64: ./build_headless_chrome.sh <chrome-version-SHA>
. Linux arm64: ./build_headless_chrome.sh <chrome-version-SHA> arm64

# How to call in Command line:
. PNG report: ./headless_shell --headless --disable-gpu --screenshot=test.png https://opendistro.github.io/for-elasticsearch
. PDF report: ./headless_shell --headless --disable-gpu --print-to-pdf=test.pdf https://opendistro.github.io/for-elasticsearch

## Headless Chromium for MAC
# Files:
    headless_shell
    libswiftshader_libGLESv2.dylib
    
## Headless Chromium for Linux (arm64 and x64)
# Files:
    headless_shell
    swiftshader
      |-libEGL.so
      |-libEGL.so.TOC
      |-libGLESv2.so
      |-libGLESv2.so.TOC
# Additional libaries:
- Ubuntu needs additional dependencies to run chromium 
```
sudo apt install -y libnss3-dev fonts-liberation libfontconfig1
```
- RedHat/CentOS needs additional dependencies to run chromium
```
sudo yum install -y libnss3.so xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc fontconfig freetype
```

