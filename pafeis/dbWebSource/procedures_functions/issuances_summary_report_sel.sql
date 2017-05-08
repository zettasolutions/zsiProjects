
CREATE PROCEDURE [dbo].[issuances_summary_report_sel]
(
    @issuance_type      varchar(50)=null
   ,@date_from	        NVARCHAR(15) = NULL
   ,@date_to	        NVARCHAR(15) = NULL
   ,@warehouse_id       INT = NULL

)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt VARCHAR(MAX)

  SET @stmt =  'SELECT * FROM dbo.issuances_v where 1=1 '
  
	IF (NOT @date_from IS NULL) AND (NOT @date_to IS NULL)
		SET @stmt = @stmt + 'AND issued_date >= ''' + @date_from + ''' AND issued_date <= ''' + @date_to + ''' '

  IF @warehouse_id IS NOT NULL  
      SET @stmt = @stmt + ' AND warehouse_id= ' + cast(@warehouse_id as varchar(20))

   IF ISNULL(@issuance_type,'') <> ''
      SET @stmt = @stmt + ' AND issuance_type= ''' + @issuance_type + ''''

   SET @stmt = @stmt + ' ORDER BY issued_date '
   
  EXEC(@stmt);	
END


