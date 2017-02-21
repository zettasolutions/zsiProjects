
CREATE PROCEDURE [dbo].[issuance_report_sel]
(
    @user_id int = NULL
   ,@pno INT = 1
   ,@rpp INT = 100
)
AS
BEGIN
	DECLARE @stmt           VARCHAR(4000);
	DECLARE @count INT = 0;
	DECLARE @page_count INT = 1;

	SET @stmt = 'SELECT dbo.getOrganizationName(transfer_warehouse_id) AS issued_to, ' +
                'dbo.getOrganizationName(warehouse_id) AS issued_from, ' +
	            'item_code + '': '' + item_name AS component, issued_date ' +
                'FROM dbo.issuance_details_v ' +
				'WHERE transfer_warehouse_id IS NOT NULL ' +
				'AND item_cat_id = 23 ' +
				'ORDER BY 4 '
	
	SELECT @count = COUNT(*) FROM dbo.issuance_details_v WHERE transfer_warehouse_id IS NOT NULL AND item_cat_id = 23; 

	SET @stmt = @stmt + ' OFFSET (' + CAST(@pno-1 AS VARCHAR(20)) +')*' + CAST(@rpp AS VARCHAR(20)) + ' ROWS FETCH NEXT ' + CAST(@rpp AS VARCHAR(20)) + ' ROWS ONLY '; 
	
	EXEC(@stmt);

	SET @page_count =  CEILING((CONVERT(DECIMAL(20,5),@count))/@rpp);

	RETURN @page_count;
END;


