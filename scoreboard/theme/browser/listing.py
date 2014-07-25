""" Listing Views
"""
from urllib import urlencode
from zope.component import queryUtility
from zope.security import checkPermission
from zope.annotation.interfaces import IAnnotations
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from persistent.list import PersistentList
from plone.uuid.interfaces import IUUID

from plone.registry.interfaces import IRegistry
from edw.datacube.interfaces import IDataCubeSettings
from edw.datacube.browser.query import jsonify
from edw.datacube.interfaces import defaults

from scoreboard.theme.interfaces import IDatasetsContainer
from scoreboard.theme.interfaces import IVisualizationsContainer
import operator


ORDER = 'scoreboard.visualization.order'


class DocListingView(BrowserView):

    def get_docs(self):
        catalog = getToolByName(self.context, 'portal_catalog')
        path = {
            'query': '/'.join(self.context.getPhysicalPath())
        }
        portal_types = ['File', 'Link']
        results = [b.getObject() for b in catalog(path=path, portal_type=portal_types)]
        results.sort(key = lambda x: x.modified(), reverse=True)
        return results;
        #.title
        #.creation_date
        #.absolute_url_path()

class ListingView(BrowserView):
    _cubeSettings = None

    @property
    def cubeSettings(self):
        """ Settings
        """
        if self._cubeSettings is None:
            self._cubeSettings = queryUtility(
                IRegistry).forInterface(IDataCubeSettings, False)
        return self._cubeSettings

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

    def getItemState(self, obj):
        """ Item state
        """
        wft = getToolByName(self.context, 'portal_workflow')
        return wft.getInfoFor(obj, 'review_state', '')


    def fetchDatacubes(self, optionsList=False):
        catalog = getToolByName(self.context, 'portal_catalog')
        query = {
            'portal_type': 'DataCube',
        }
        for brain in catalog(**query):
            cube = brain.getObject()
            url = cube.absolute_url()
            thumbnail_field = cube.getField('thumbnail')
            thumbnail = thumbnail_field.getAccessor(cube)()
            if thumbnail:
                image_url = '%s/thumbnail' % url
            else:
                image_url = self.cubeSettings.datacube_thumbnail
            if optionsList:
                yield {
                    'inner_order': None,
                    'label': cube.title_or_id(),
                    'notation': cube.getDataset(),
                    'uri': url,
                    'group_notation': None,
                    'short_label': None,
                    'dataset': cube.getDataset(),
                    'endpoint': cube.getEndpoint()
                }
            else:
                yield {
                    'id': cube.getId(),
                    'portal_type': cube.portal_type,
                    'url': url,
                    'image': image_url,
                    'title': cube.getExtended_title(),
                    'identifier': cube.title_or_id(),
                    'description': cube.getSummary(),
                }


    def dataCubesListing(self):
        return jsonify(self.request, [x for x in self.fetchDatacubes()], cache=False)


    def dataCubesListingForSelect(self):
        data = {
            "options": [x for x in self.fetchDatacubes(optionsList=True)]
        }
        return jsonify(self.request, data,  cache=False)


class HomepageListingView(ListingView):
    """ Listing for homepage
    """
    _cubeSettings = None

    @property
    def cubeSettings(self):
        """ Settings
        """
        if self._cubeSettings is None:
            self._cubeSettings = queryUtility(
                    IRegistry).forInterface(IDataCubeSettings, False)
        return self._cubeSettings

    @property
    def defaultCRUrl(self):
        from_registry = self.cubeSettings.default_cr_url
        if not from_registry:
            return defaults.DEFAULT_CR_URL
        return from_registry

    def getDataCubes(self):
        """ All Data Cubes sorted by their position in parent
        """
        query = {
            'portal_type': 'DataCube',
            'sort_on': 'getObjPositionInParent'
        }

        catalog = getToolByName(self.context, 'portal_catalog');
        return [b.getObject() for b in catalog(**query)]

    def addDataCube(self, **kwargs):
        portal_type = 'DataCube'
        container = self.queryCatalog(IDatasetsContainer, portal_type)
        url = container.createObject(type_name=portal_type)
        params = {}
        params.update(self.request.form)
        params.update(kwargs)
        redirect_url = '%(url)s?%(params)s' % {
                'url': url,
                'params': urlencode(params)
        }
        self.request.response.redirect(redirect_url)

class VisualizationsListingView(ListingView):
    """ Visualizations listing
    """
    def visualizations(self):
        """
        Return all visualization for this context sorted by position
        in parent
        """
        relations = (relation for relation in self.context.getBRefs()
                if checkPermission('zope2.View', relation))
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

    def addVisualization(self, **kwargs):
        portal_type = 'ScoreboardVisualization'
        container = self.queryCatalog(IVisualizationsContainer, portal_type)
        url = container.createObject(type_name=portal_type)
        params = {'relatedItems': self.context.UID()}
        params.update(self.request.form)
        params.update(kwargs)
        redirect_url = '%(url)s?%(params)s' % {
                'url': url,
                'params': urlencode(params)
        }
        self.request.response.redirect(redirect_url)
