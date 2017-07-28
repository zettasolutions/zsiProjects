
create view [dbo].[request_types_v] as
select '1' request_type_id,'New' request_desc
union
select '2' request_type_id,'Change' request_desc
union
select '3' request_type_id,'Error' request_desc

