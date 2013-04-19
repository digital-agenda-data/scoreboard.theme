""" Views
"""
import os
import Globals
from Products.Five.browser import BrowserView
from edw.datacube.browser.query import jsonify


TEMPLATES = {}
CONTAINER_PATH = os.path.join(os.path.dirname(__file__))
TEMPLATES_PATH = os.path.join(CONTAINER_PATH, 'templates', 'js')
LOADABLE = ['navigation', 'scenario-navigation']


def loadTemplates(names):
    for name in names:
        fname = name + '.html'
    TEMPLATES[name] = open(os.path.join(TEMPLATES_PATH, fname)).read()


loadTemplates(LOADABLE)


class JSTemplatesView(BrowserView):
    def getTemplates(self):
        if Globals.DevelopmentMode:
            loadTemplates(LOADABLE)

        return jsonify(self.request, TEMPLATES)

