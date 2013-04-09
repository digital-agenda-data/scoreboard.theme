from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName


class HomepageListingView(BrowserView):

    def getDataCubes(self):
        query = {'portal_type': 'DataCube'}
        catalog = getToolByName(self.context, 'portal_catalog');
        return [b.getObject() for b in catalog(**query)]

    def getItemState(self, obj):
        wft = getToolByName(self.context, 'portal_workflow')
        return wft.getInfoFor(obj, 'review_state', '')
