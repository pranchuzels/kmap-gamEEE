from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50)
    score = models.IntegerField()
    difficulty = models.IntegerField()

    q_num_var = models.IntegerField()
    q_form = models.CharField(max_length=5)
    q_terms = models.JSONField()
    q_dont_cares = models.JSONField()
    
