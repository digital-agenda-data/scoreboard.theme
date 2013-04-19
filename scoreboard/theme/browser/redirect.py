""" Redirect Views
"""
from zope.component.hooks import getSite
from Products.Five.browser import BrowserView


class DatasetContainerRedirectView(BrowserView):
    def __call__(self, *args, **kwargs):
        return self.request.response.redirect(getSite().absolute_url())

class VisualizationsContainerRedirectView(BrowserView):
    def __call__(self, *args, **kwargs):
        return self.request.response.redirect(getSite().absolute_url())

