from django.db import models
from django.utils.text import slugify

class Post(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField()
    slug = models.SlugField(unique=True)
    date = models.DateTimeField(auto_now_add=True)
    points_outbound = models.JSONField(default=list, blank=True)
    points_inbound = models.JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title