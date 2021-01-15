


CREATE PROCEDURE [dbo].[dd_civil_status_sel] 
(
	@user_id				INT = NULL
)
as
	

begin
	SELECT * FROM dbo.civil_statuses WHERE 1=1;
end
