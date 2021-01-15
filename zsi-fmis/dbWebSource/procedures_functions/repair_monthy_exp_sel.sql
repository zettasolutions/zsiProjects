
CREATE PROCEDURE [dbo].[repair_monthy_exp_sel]
(
      @client_id int 
	 ,@user_id int=NULL
)
AS
BEGIN
	DECLARE @stmt nvarchar(max)='';
	DECLARE @year INT;
	DECLARE @tbl nvarchar(30);
	SET @tbl = CONCAT('dbo.vehicle_repairs_',@client_id);
	SET @year = YEAR(DATEADD(HOUR,8,GETUTCDATE()));


	SET @stmt = CONCAT('SELECT MONTH(repair_date) repair_month,  SUM(total_repair_amount) total_repair  FROM ',@tbl, 
						' WHERE  YEAR(repair_date)=',@year,
						' GROUP BY MONTH(repair_date)'); 

	EXEC(@stmt);
END;

 --[dbo].[repair_monthy_exp_sel] @client_id=1