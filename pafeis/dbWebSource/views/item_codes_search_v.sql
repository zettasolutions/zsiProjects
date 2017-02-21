CREATE VIEW dbo.item_codes_search_v
AS
SELECT item_code_id, isnull(part_no,'') + IIF(part_no IS NULL or national_stock_no IS NULL,'',N'/') + isnull(national_stock_no,'') + IIF(part_no IS NULL and national_stock_no IS NULL,'',N' ') + item_name AS item_description
FROM dbo.item_codes
