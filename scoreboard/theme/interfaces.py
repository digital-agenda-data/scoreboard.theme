""" Interfaces
"""
from zope.interface import Interface


class IDatasetsContainer(Interface):
    """ Marker interface for dataset container
    """

class IVisualizationsContainer(Interface):
    """ Marker interface for visualizations container
    """

class IThemeSpecific(Interface):
    """Marker interface that defines a Zope 3 browser layer.
    """
