""" Listing Views
"""
from zope.annotation.interfaces import IAnnotations
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from persistent.list import PersistentList
from plone.uuid.interfaces import IUUID

from scoreboard.theme.interfaces import IDatasetsContainer
from scoreboard.theme.interfaces import IVisualizationsContainer


ORDER = 'scoreboard.visualization.order'


class ListingView(BrowserView):

    def queryCatalog(self, interface):
        catalog = getToolByName(self.context, 'portal_catalog')
        for brain in catalog(object_provides=interface.__identifier__):
            return brain.getObject()


class HomepageListingView(ListingView):
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

    def addDataCube(self):
        container = self.queryCatalog(IDatasetsContainer)
        url = container.createObject(type_name='DataCube')
        self.request.response.redirect(url)


class VisualizationsListingView(ListingView):
    """ Visualizations listing
    """
    def visualizations(self):
        """
        Return all visualization for this context sorted by position
        in parent
        """
        relations = self.context.getBRefs()
        anno = IAnnotations(self.context)
        order = anno.get(ORDER, ())
        mapping = dict((IUUID(relation, ''), relation)
                       for relation in relations)

        # Return ordered relations
        for uid in order:
            relation = mapping.get(uid, None)
            if not relation:
                continue
            yield relation

        # Return remaining relations
        for uid, relation in mapping.items():
            if uid in order:
                continue
            yield relation

    def sort(self, **kwargs):
        """ Sort items
        """
        kwargs.update(self.request.form)
        order = kwargs.get('order', [])
        if not order:
            return 'Nothing to do'

        anno = IAnnotations(self.context)
        anno[ORDER] = PersistentList(order)
        return 'Done'

    def addVisualization(self):
        container = self.queryCatalog(IVisualizationsContainer)
        url = container.createObject(type_name='ScoreboardVisualization')
        redirect_url = '%(url)s?relatedItems=%(uid)s' % {
                'url': url,
                'uid': self.context.UID()
        }
        self.request.response.redirect(redirect_url)
