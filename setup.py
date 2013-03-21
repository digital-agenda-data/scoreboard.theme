""" Installer
"""
import os
from os.path import join
from setuptools import setup, find_packages

NAME = 'scoreboard.theme'
PATH = NAME.split('.') + ['version.txt']
VERSION = open(join(*PATH)).read().strip()


setup(name=NAME,
      version=VERSION,
      description="Diazo Theme for Scoreboard",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
        "Programming Language :: Python",
        ],
      keywords='scoreboard diazo theme',
      author='Eau de Web',
      author_email='contact@eaudeweb.ro',
      url='http://github.com/eaudeweb/scoreboard.theme',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['scoreboard'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
