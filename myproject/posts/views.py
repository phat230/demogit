from pydoc import pager
from django.shortcuts import get_object_or_404, render
from .models import Post
from django.http import HttpResponse

# Create your views here.
def post_list(request):
    posts = Post.objects.all().order_by("-date")
    return render(request, "posts/post_list.html", {"posts": posts})

def post_page(request, slug):
    detail = get_object_or_404(Post, slug=slug)
    return render(request, "posts/post_page.html", {"detail": detail})