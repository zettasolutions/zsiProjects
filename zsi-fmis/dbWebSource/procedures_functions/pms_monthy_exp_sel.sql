
CREATE PROCEDURE [dbo].[pms_monthy_exp_sel]
(
      @client_id int 
	 ,@user_id int=NULL
)
AS
BEGIN
	DECLARE @stmt nvarchar(max)='';
	DECLARE @year INT;
	DECLARE @tbl nvarchar(30);
	SET @tbl = CONCAT('dbo.vehicle_pms_',@client_id);
	SET @year = YEAR(DATEADD(HOUR,8,GETUTCDATE()));


	SET @stmt = CONCAT('SELECT MONTH(pms_date) pms_month,  SUM(total_pms_amount) total_pms  FROM ',@tbl, 
						' WHERE YEAR(pms_date)=',@year,
						' GROUP BY MONTH(pms_date)'); 

	EXEC(@stmt);
END;

 --[dbo].[pms_monthy_exp_sel] @client_id=1