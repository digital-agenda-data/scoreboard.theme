""" Listing Views
"""
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName


class HomepageListingView(BrowserView):
    """ Listing for homepage
    """
    def getDataCubes(self):
        """ All Data Cubes sorted by their position in parent
        """
        query = {
            'portal_type': 'DataCube',
            'sort_on': 'getObjPositionInParent'
        }

        catalog = getToolByName(self.context, 'portal_catalog');
        return [b.getObject() for b in catalog(**query)]

    def getItemState(self, obj):
        """ Item state
        """
        wft = getToolByName(self.context, 'portal_workflow')
        return wft.getInfoFor(obj, 'review_state', '')


class VisualizationsListingView(BrowserView):
    """ Visualizations listing
    """
    def visualizations(self):
        """
        Return all visualization for this context sorted by position
        in parent
        """
        relations = self.context.getBRefs()
        return relations
