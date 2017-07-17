create view requests_v as
select '1' request_id,'New' request_desc
union
select '2' request_id,'Change' request_desc
union
select '3' request_id,'Error' request_desc
