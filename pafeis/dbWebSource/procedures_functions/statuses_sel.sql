

-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 10:01 PM
-- Description:	Manufacturer select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[statuses_sel]
(
    @status_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @status_id IS NOT NULL  
	 SELECT * FROM dbo.statuses WHERE status_id = @status_id; 
  ELSE
     SELECT * FROM dbo.statuses
	 ORDER BY status_name; 
	
END



