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

    def queryCatalog(self, interface, portal_type=None):
        catalog = getToolByName(self.context, 'portal_catalog')
        iface = interface.__identifier__
        for brain in catalog(object_provides=iface):
            return brain.getObject()

        raise LookupError(
            u"First you need to define the default container for adding '%s' "
            "objects by adding '%s' marker interface within "
            "ZMI > manage_interfaces. Don't forget to apply reindexObject. You "
            "can easily do that by calling: /edit > Save" % (portal_type, iface)
        )


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
        portal_type = 'DataCube'
        container = self.queryCatalog(IDatasetsContainer, portal_type)
        url = container.createObject(type_name=portal_type)
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
        portal_type = 'ScoreboardVisualization'
        container = self.queryCatalog(IVisualizationsContainer, portal_type)
        url = container.createObject(type_name=portal_type)
        redirect_url = '%(url)s?relatedItems=%(uid)s' % {
                'url': url,
                'uid': self.context.UID()
        }
        self.request.response.redirect(redirect_url)
