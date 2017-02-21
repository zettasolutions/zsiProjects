


-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 6:53 PM
-- Description:	Monitoring types select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[monitoring_types_sel]
(
    @monitoring_type_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @monitoring_type_id IS NOT NULL  
	 SELECT * FROM dbo.monitoring_types WHERE monitoring_type_id = @monitoring_type_id; 
  ELSE
     SELECT * FROM dbo.monitoring_types
	 ORDER BY monitoring_type_name; 
	
END




