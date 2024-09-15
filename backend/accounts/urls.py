from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/',views.LogoutView.as_view(),name='logout'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
]