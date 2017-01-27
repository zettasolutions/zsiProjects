CREATE VIEW dbo.item_disposal_search_v
AS
SELECT        a.item_id, isnull(a.serial_no, '') + iif(a.serial_no IS NULL OR
                         c.part_no IS NULL, '', N'/') + isnull(c.part_no, '') + iif(c.part_no IS NULL OR
                         c.national_stock_no IS NULL, '', N'/') + isnull(c.national_stock_no, '') + iif(a.serial_no IS NULL AND c.part_no IS NULL AND c.national_stock_no IS NULL, '', N' ') + item_name AS item_description
FROM            dbo.items AS a 
INNER JOIN dbo.items_inv AS b ON a.item_inv_id = b.item_inv_id 
INNER JOIN dbo.item_codes AS c ON c.item_code_id = b.item_code_id
WHERE        isnull(a.status_id, '') <> 27 
