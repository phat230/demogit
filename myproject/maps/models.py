from django.db import models

class Point(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tiêu đề")
    address = models.CharField(max_length=255, verbose_name="Địa chỉ")
    routes = models.CharField(max_length=255, verbose_name="Các tuyến đi qua")
    latitude  = models.FloatField(verbose_name="Vĩ độ")
    longitude = models.FloatField(verbose_name="Kinh độ")

    class Meta:
        verbose_name = "Điểm bản đồ"
        verbose_name_plural = "Các điểm bản đồ"

    def __str__(self):
        return self.title
