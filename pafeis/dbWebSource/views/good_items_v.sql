CREATE VIEW dbo.good_items_v
AS
SELECT        dbo.items_v.*
FROM            dbo.items_v
WHERE        (aircraft_name = N'23')
