CREATE VIEW dbo.items_v
AS
SELECT        dbo.items.item_id, dbo.items.serial_no, dbo.items.manufacturer_id, dbo.getManufacturerName(dbo.items.manufacturer_id) AS manufacturer_name, dbo.items.dealer_id, dbo.getDealerName(dbo.items.dealer_id) 
                         AS dealer_name, dbo.items.supply_source_id, dbo.getSupplySourceName(dbo.items.supply_source_id) AS supply_source_name, dbo.items.time_since_new, dbo.items.time_before_overhaul, 
                         dbo.items.time_since_overhaul, dbo.items.remaining_time, dbo.items.date_delivered, dbo.items.aircraft_info_id, dbo.items.date_issued, dbo.items.status_id, dbo.items_inv_v.part_no, 
                         dbo.items_inv_v.national_stock_no, dbo.items_inv_v.item_name, dbo.items_inv_v.reorder_level, dbo.items_inv_v.organization_id, dbo.items_inv_v.stock_qty, dbo.items_inv_v.item_cat_id, 
                         dbo.items_inv_v.item_type_name, dbo.items_inv_v.is_active, dbo.items_inv_v.item_code_id, dbo.items.no_repairs, dbo.items.no_overhauls, dbo.items.item_inv_id, dbo.items_inv_v.warehouse_id, 
                         dbo.items.parent_item_id, dbo.getStatus(dbo.items.status_id) AS item_status
FROM            dbo.items INNER JOIN
                         dbo.items_inv_v ON dbo.items.item_inv_id = dbo.items_inv_v.item_inv_id
WHERE        (dbo.items.status_id <> 15) AND (ISNULL(dbo.items.aircraft_info_id, 0) = 0)
