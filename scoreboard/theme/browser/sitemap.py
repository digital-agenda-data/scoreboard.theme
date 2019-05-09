# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from plone import api


class CustomSiteMap(BrowserView):


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