
CREATE VIEW [dbo].[items_for_repair_serials_v]
AS
SELECT *
FROM            dbo.items_v 
WHERE        (dbo.items_v.item_status = 'FOR REPAIR')

