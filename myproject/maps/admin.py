from django.contrib import admin
from .models import Point

@admin.register(Point)
class PointAdmin(admin.ModelAdmin):
    list_display  = ('title', 'address', 'routes', 'latitude', 'longitude')
    search_fields = ('title', 'address', 'routes')
