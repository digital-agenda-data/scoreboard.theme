# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from plone import api


class CustomSiteMap(BrowserView):
    def get_documentation(self):
        portal_path = api.portal.get().virtual_url_path()
        try:
            doc = self.context.restrictedTraverse(portal_path+'/documentation')
            return map(lambda d: d[1], doc.contentItems())
        except:
            return False

    def get_privacy(self):
        portal_path = api.portal.get().virtual_url_path()
        try:
            priv = self.context.restrictedTraverse(portal_path+'/privacy')
            return priv.absolute_url()
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
        portal = api.portal.get()
        portal_url = portal.absolute_url()
        portal_path = portal.virtual_url_path()

        ctool = getToolByName(self.context, 'portal_catalog')
        brains = ctool({'portal_type': 'DataCube'})

        return list(map(
            lambda b: {
                'title': b.Title,
                'metadata': b.getURL(),
                'indicators': b.getURL()+'/indicators',
                'comments': '{}/board/{}'.format(portal_url, b.id),
                'charts': {
                    'url': '{}/datasets/{}/visualizations'.format(
                        portal_url, b.id
                    ),
                    'contents': self.get_charts(b, portal_path)
                }
            },
            brains
        ))