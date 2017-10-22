create VIEW [dbo].[dtr_v]

AS

SELECT        dtr_id, employee_id, time_in, time_out,DATEDIFF(hour,getutcdate(),getdate()) as utc_diff 

FROM            dbo.dtr