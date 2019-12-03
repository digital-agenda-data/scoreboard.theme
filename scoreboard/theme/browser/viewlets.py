from plone import api
from plone.app.layout.viewlets.common import PathBarViewlet


class BreadcrumbsViewlet(PathBarViewlet):
    def update(self):
        super(BreadcrumbsViewlet, self).update()

        portal = api.portal.get()
        portal_url = portal.absolute_url()

        breadcrumbs = self.breadcrumbs

        for idx, crumb in enumerate(breadcrumbs):
            try:
                url = crumb['absolute_url']
                path = url[url.rfind(portal_url)+len(portal_url)+1:]

                if portal.unrestrictedTraverse(path).meta_type == 'PloneboardForum':
                    vis = {
                        'absolute_url': "{}/datasets/{}/visualizations".format(portal_url, path[path.rfind("/")+1:]),
                        'Title': crumb['Title']
                    }
                    crumb['Title'] = 'Comments'
                    breadcrumbs = breadcrumbs[:idx] + (vis,) + breadcrumbs[idx:]
            except:
                continue

        self.breadcrumbs = breadcrumbs
