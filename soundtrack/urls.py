from django.urls import path
from . import views

urlpatterns = [
    path('', views.Home, name='home'),
    path('track', views.Track, name='track'),
    path('connect', views.Connect, name="connect"),
    path('sortsongs', views.Sortsongs, name="sortsongs")
    # path('camera', views.Camera, name='camera'),
]

from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,
                              document_root=settings.MEDIA_ROOT)