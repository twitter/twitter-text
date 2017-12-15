IFUnicodeURL is a category for NSURL which will allow it to support Internationalized domain names in URLs.

This uses code from IDN SDK from Verisign, Inc. The entire IDN SDK source package is included in IDNSDK-1.1.0.zip. I have pulled out and slightly modified (to avoid compiler and analyzer warnings) the files and headers needed so that building this in XCode is as easy as adding the IFUnicodeURL folder to your project.

Take note of the IDNSDK license which can be found in the IDNSDK-1.1.0.zip file. (The license is basically a BSD-like license.) The IFUnicodeURL category is licensed under the Simplified BSD License (see IFUnicodeURL-LICENSE.txt)

- Sean Heber
- sean@iconfactory.com
- http://www.iconfactory.com
