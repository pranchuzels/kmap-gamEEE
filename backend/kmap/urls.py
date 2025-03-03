from django.urls import path
from .views import CheckUser, CheckAnswer

urlpatterns = [
    path('user', CheckUser.as_view(), name='check-user'),
    path('game', CheckAnswer.as_view(), name='check-answer'),
]
