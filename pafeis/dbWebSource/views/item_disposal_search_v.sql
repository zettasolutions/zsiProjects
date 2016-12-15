CREATE VIEW dbo.item_disposal_search_v
AS
select a.item_id,
       isnull(a.serial_no, '') + 
       iif(a.serial_no is null or b.part_no is null, '',N'/') + isnull(b.part_no, '') +  iif(b.part_no is null or b.national_stock_no is null, '', N'/') + isnull(b.national_stock_no, '') +
	   iif(a.serial_no is null and b.part_no is null and b.national_stock_no is null, '', N' ') +
	   item_name as item_description
from dbo.items as a 
inner join dbo.item_codes as b on a.item_code_id = b.item_code_id
inner join dbo.item_types as c on b.item_type_id = c.item_type_id
where isnull(a.status_id, '') <> 27
and c.item_cat_id = 23
