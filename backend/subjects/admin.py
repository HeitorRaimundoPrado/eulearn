from django.contrib import admin
from .models import Subject

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'route')
# Register your models here.
admin.site.register(Subject, SubjectAdmin)
