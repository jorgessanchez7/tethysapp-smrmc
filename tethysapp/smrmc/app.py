from tethys_sdk.base import TethysAppBase, url_map_maker


class Smrmc(TethysAppBase):
    """
    Tethys app class for Sistema de Monitoreo de los Rios Magdalena y Cauca.
    """

    name = 'Sistema de Monitoreo de los Rios Magdalena y Cauca'
    index = 'smrmc:home'
    icon = 'smrmc/images/Rio_Magdalena_map.png'
    package = 'smrmc'
    root_url = 'smrmc'
    color = '#2c3e50'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='smrmc',
                controller='smrmc.controllers.home'
            ),
            UrlMap(
                name='tiempo_real',
                url='smrmc/tiempo_real',
                controller='smrmc.controllers.tiempo_real'
            ),
            UrlMap(
                name='historico',
                url='smrmc/historico',
                controller='smrmc.controllers.historico'
            ),
            UrlMap(
                name='pronostico',
                url='smrmc/pronostico',
                controller='smrmc.controllers.pronostico'
            ),
            UrlMap(
                name='about',
                url='smrmc/about',
                controller='smrmc.controllers.about'
            ),
            UrlMap(
                name='get_realTimeObsDataH',
                url='tiempo_real/get-realTimeObsDataH',
                controller='smrmc.controllers.get_realTimeObsDataH'
            ),
            UrlMap(
                name='download_realTimeObsDataH',
                url='tiempo_real/download-realTimeObsDataH',
                controller='smrmc.controllers.download_realTimeObsDataH'
            ),
        )

        return url_maps
