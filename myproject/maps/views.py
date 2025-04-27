from django.shortcuts import render
from .models import Point
import json

def simplemap(request):
    qs = Point.objects.all().values('latitude', 'longitude', 'title', 'address', 'routes')
    points_json = json.dumps(list(qs))
    
    context = {
        'points_json': points_json,
        'center_lat': 10.773994,
        'center_lng': 106.697114,
        'default_zoom': 16,
    }
    return render(request, "simple-map.html", context)
