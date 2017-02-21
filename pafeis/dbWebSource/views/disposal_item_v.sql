CREATE VIEW dbo.disposal_item_v
AS
SELECT        TOP (100) PERCENT disposal_item_id, item_id, dbo.getItemSerialNo(item_id) AS serial_no, dbo.getSerialNoPlusItemDescription(disposal_item_id) AS item_name, quantity, authority_ref, remarks, status_id, 
                         dbo.getStatus(status_id) AS status_name, disposed_by, disposed_date
FROM            dbo.disposal_item
WHERE        (dbo.getSerialNoPlusItemDescription(disposal_item_id) IS NOT NULL)
