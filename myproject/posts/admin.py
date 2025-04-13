from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'date')
    list_filter = ('date',)
    search_fields = ('title', 'body')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'body')
        }),
        ('Route Information', {
            'fields': ('points_outbound', 'points_inbound')
        }),
        ('Metadata', {
            'fields': ('date',)
        }),
    )
    readonly_fields = ('date',)

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('slug',)
        return self.readonly_fields