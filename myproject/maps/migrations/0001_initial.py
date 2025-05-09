# Generated by Django 5.1.6 on 2025-04-27 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Point",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=200, verbose_name="Tiêu đề")),
                (
                    "description",
                    models.TextField(blank=True, verbose_name="Nội dung Popup"),
                ),
                (
                    "latitude",
                    models.DecimalField(
                        decimal_places=6, max_digits=9, verbose_name="Vĩ độ"
                    ),
                ),
                (
                    "longitude",
                    models.DecimalField(
                        decimal_places=6, max_digits=9, verbose_name="Kinh độ"
                    ),
                ),
            ],
            options={
                "verbose_name": "Điểm bản đồ",
                "verbose_name_plural": "Các điểm bản đồ",
            },
        ),
    ]
