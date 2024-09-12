# from django.urls import path
# from django.shortcuts import HttpResponse
# from .views import api_root,register,login,user_list,update_user

# urlpatterns=[
#     path('',api_root,name="api_root"),
#     path('register/',register,name='register'),
#     path('login/',login,name='login'),
#     path('user_list/',user_list,name="user_list"),
#     path('update_user/<str:pk>/',update_user,name="update_user"),
# ]


from django.urls import path
from .views import UserViewSet,LoginView
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'users',UserViewSet,basename='user')

urlpatterns=router.urls+[
    path('login/',LoginView.as_view(),name='login'),
]