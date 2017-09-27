CREATE VIEW dbo.item_status_quantity_v
AS
SELECT        dbo.item_status_quantity.item_inv_id, dbo.item_status_quantity.status_id, dbo.item_status_quantity.stock_qty, dbo.item_status_quantity.bin, dbo.item_status_quantity.reserved_qty, dbo.statuses.status_name, 
                         dbo.items_inv_v.part_no, dbo.items_inv_v.national_stock_no, dbo.items_inv_v.item_name
FROM            dbo.item_status_quantity INNER JOIN
                         dbo.statuses ON dbo.item_status_quantity.status_id = dbo.statuses.status_id INNER JOIN
                         dbo.items_inv_v ON dbo.item_status_quantity.item_inv_id = dbo.items_inv_v.item_inv_id
