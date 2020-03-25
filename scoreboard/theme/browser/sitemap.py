# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from plone import api


class CustomSiteMap(BrowserView):
    def __init__(self, context, request):
        super(BrowserView, self).__init__(context, request)
        self.portal = api.portal.get()

    def get_documentation(self):
        try:
            doc = self.portal.restrictedTraverse('documentation')
            return map(lambda d: d[1], doc.contentItems())
        except:
            return False

    def get_privacy(self):
        try:
            priv = self.portal.restrictedTraverse('privacy')
            return priv.absolute_url()
        except:
            return False

    def get_about_page(self):
        try:
            about = self.portal.restrictedTraverse('about')
            return about.absolute_url()
        except:
            return False

    def get_charts(self, brain, portal):
        charts = self.context.restrictedTraverse(
            '{}/datasets/{}/visualizations'.format(portal, brain.id)
        )
        return list(map(
            lambda b: {
                'title': b.Title(),
                'url': b.absolute_url()
            },
            charts.visualizations()
        ))

    def datasets(self):
        portal_url = self.portal.absolute_url()

        ctool = getToolByName(self.context, 'portal_catalog')
        brains = ctool({'portal_type': 'DataCube'})

        return list(map(
            lambda b: {
                'title': b.getObject().getExtended_title()
                         or b.getObject().title_or_id(),
                'metadata': b.getURL(),
                'indicators': b.getURL()+'/indicators',
                'comments': '{}/board/{}'.format(portal_url, b.id),
                'charts': {
                    'url': '{}/datasets/{}/visualizations'.format(
                        portal_url, b.id
                    ),
                    'contents': self.get_charts(b, self.portal.id)
                }
            },
            brains
        ))