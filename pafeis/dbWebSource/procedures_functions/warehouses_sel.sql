-- ===================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: November 7, 2016 8:23PM
-- Description:	Select warehouses by wing records.
-- ===================================================================================================
-- Updated by	| Date		| Description
-- ===================================================================================================
-- Add your name, date, and description of your changes here. Thanks
-- ===================================================================================================

CREATE PROCEDURE [dbo].[warehouses_sel]
(
    @wing_id	INT = null
   ,@is_active  CHAR(1) = 'Y'
   ,@col_no     INT=1
   ,@order_no   INT=0
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

  SET @stmt = 'SELECT * FROM dbo.warehouses WHERE is_active = ''' + @is_active + ''''
 
  IF ISNULL(@wing_id,'') <> '' 	 
	 SET @stmt = @stmt + ' and wing_id = ' + cast(@wing_id as varchar(20)); 
 
  SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no as varchar(20)) 
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC'
  ELSE
  	 SET @stmt = @stmt + ' DESC'
	 
  EXEC(@stmt)
END

