
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 5:10 PM
-- Description:	Aircraft class select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[aircraft_class_sel]
(
    @aircraft_class_id  INT = null
)
AS
BEGIN

SET NOCOUNT ON

  IF @aircraft_class_id IS NOT NULL  
	 SELECT * FROM dbo.aircraft_class WHERE aircraft_class_id = @aircraft_class_id; 
  ELSE
     SELECT * FROM dbo.aircraft_class
	 ORDER BY aircraft_class; 
	
END

