CREATE VIEW dbo.assembly_item_search_v
AS
SELECT        dbo.items.serial_no, dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_codes.critical_level, dbo.item_types.item_type_name, dbo.items.time_since_new, 
                         dbo.items.time_before_overhaul, dbo.items.time_since_overhaul, null remaining_time_hr, null remaining_time_min, dbo.items.date_delivered, dbo.items.date_issued, 
                         '' organization_name
FROM            dbo.item_codes INNER JOIN
                         dbo.item_types ON dbo.item_codes.item_type_id = dbo.item_types.item_type_id INNER JOIN
                         dbo.items_inv ON dbo.item_codes.item_code_id = dbo.items_inv.item_code_id INNER JOIN
                         dbo.items ON dbo.items_inv.item_inv_id = dbo.items.item_inv_id
WHERE        (dbo.item_types.item_cat_id = 15) AND (dbo.item_codes.is_active = 'Y') AND (dbo.item_types.is_active = N'Y')

