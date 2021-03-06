from plone import api
from plone.app.layout.viewlets.common import PathBarViewlet


class BreadcrumbsViewlet(PathBarViewlet):
    def update(self):
        super(BreadcrumbsViewlet, self).update()

        portal = api.portal.get()
        portal_url = portal.absolute_url()

        breadcrumbs = self.breadcrumbs

        for idx, crumb in enumerate(breadcrumbs):
            url = crumb['absolute_url']
            path = url[url.rfind(portal_url)+len(portal_url)+1:]

            if 'datacube.' in path or 'scoreboardvisualization.' in path:
                path = path[0:path.rfind('/')]
                crumb['absolute_url'] = url[0:url.rfind('/')]

            p_trav = portal.unrestrictedTraverse(path)

            if hasattr(p_trav, 'meta_type') and \
                    p_trav.meta_type == 'PloneboardForum':
                vis = {
                    'absolute_url': "{}/datasets/{}/visualizations".format(portal_url, path[path.rfind("/")+1:]),
                    'Title': crumb['Title']
                }
                crumb['Title'] = 'Comments'
                breadcrumbs = breadcrumbs[:idx] + (vis,) + breadcrumbs[idx:]

        self.breadcrumbs = breadcrumbs
